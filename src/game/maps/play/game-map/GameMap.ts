import { Position, Size, isDefined } from "../../../../utils";
import { ExportedCell } from "../../builder/ExportedCell";
import { ExportedGrid } from "../../builder/ExportedGrid";
import { GameCell } from "../game-cell/GameCell";
import { GameCellOptions } from "../game-cell/GameCellOptions";
import { Color } from "../../../Color";
import { CellId } from "../../CellId";
import { sortBy } from "lodash";
import { TowerTemplate } from "../towers/TowerTemplate";
import { Enemy, EnemyTemplate } from "../enemies/Enemy";
import { Tower } from "../towers/specified-towers/Tower";
import { GameMapOptions } from "./GameMapOptions";

export class GameMap extends Phaser.GameObjects.Container {
  private readonly cells: GameCell[];
  private startingCell!: GameCell;

  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly path: Phaser.Curves.Path;

  private readonly columns: number;
  private readonly rows: number;
  private readonly cellSize: Size;
  private wasStartMarked = false;
  private pathIds: CellId[];
  private enemiesGroup: Phaser.GameObjects.Group;
  private towers: Tower[] = [];

  constructor(
    scene: Phaser.Scene,
    private readonly mapPosition: Position,
    private readonly mapSize: Size,
    exportedGrid: ExportedGrid,
    private readonly options: GameMapOptions<GameMap> = {},
  ) {
    super(scene);
    this.pathIds = exportedGrid.pathIds.map((rawId) =>
      CellId.fromExisting(rawId),
    );
    this.columns = exportedGrid.columns;
    this.rows = exportedGrid.rows;
    this.cellSize = {
      width: this.mapSize.width / this.columns,
      height: this.mapSize.height / this.rows,
    };

    this.wrapper = this.createWrapper(options);

    this.cells = exportedGrid.cells.map((exportedCell, index) => {
      const cell = this.createCell(exportedCell, index);
      if (cell.isStart()) {
        this.startingCell = cell;
      }
      this.scene.add.existing(cell);
      return cell;
    });
    const path = this.createPath();

    // const curve = new Phaser.Curves.Curve()
    // curve.
    // const path = new Phaser.Curves.Path()
    // const sortedCells = this.cells.sort((prevCell, nextCell) => {
    //   if prevCell.isStar
    // })
    // path.add()
    this.path = path;
    this.enemiesGroup = new Phaser.GameObjects.Group(this.scene);
  }

  updateEnemies(time: number, delta: number) {
    (this.enemiesGroup.getChildren() as Enemy[]).forEach((specifiedEnemy) =>
      specifiedEnemy.update(time, delta),
    );
  }

  updateTowers(time: number, delta: number) {
    this.towers.forEach((specifiedTower) =>
      specifiedTower.update(this.enemiesGroup.getChildren() as Enemy[]),
    );
  }

  stopTowers() {
    this.towers.forEach((specifiedTower) => specifiedTower.stop());
  }

  spawnEnemy(data: EnemyTemplate) {
    const x = this.startingCell.x;
    const y = this.startingCell.y;

    const enemy = new Enemy(
      this.scene,
      { x, y },
      this.cellSize,
      data,
      this.path,
    );
    this.enemiesGroup.add(enemy);
  }

  makePickable(data: TowerTemplate) {
    this.cells.forEach((specifiedCell) => {
      if (specifiedCell.couldBePickable()) {
        // console.info(`# Make cell pickable (id: ${specifiedCell.id})`);
        specifiedCell.makePickable(data);
      }
    });
  }

  makeUnpickable() {
    this.cells.forEach((specifiedCell) => {
      specifiedCell.makeUnpickable();
    });
  }

  private onTowerPlaced(tower: Tower) {
    this.towers.push(tower);
  }

  private createPath() {
    const unsortedPathCells = this.cells
      .filter((specifiedCell) => specifiedCell.isPath())
      .map((specifiedCell) => {
        return {
          cell: specifiedCell,
          order: this.pathIds.findIndex(
            (cellId) => cellId.value === specifiedCell.id.value,
          ),
        };
      });
    const sortedPathCells = sortBy(unsortedPathCells, ["order"]);
    const pathCells = sortedPathCells.map(({ cell }) => cell);
    const startCell = pathCells[0];
    const path = new Phaser.Curves.Path(startCell.x, startCell.y);
    pathCells.forEach((specifiedCell) =>
      path.lineTo(specifiedCell.x, specifiedCell.y),
    );
    const graphics = this.scene.add.graphics({
      lineStyle: {
        width: 2,
        color: Color.LightGrey,
      },
    });
    path.draw(graphics);

    return path;
  }

  private createCell(exportedCell: ExportedCell, index: number) {
    const columnIndex = index % this.columns;
    const rowIndex = Math.floor(index / this.rows);
    const position: Position = {
      x:
        this.mapPosition.x +
        columnIndex * this.cellSize.width -
        this.mapSize.width / 2 +
        this.cellSize.width / 2,
      y:
        this.mapPosition.y +
        rowIndex * this.cellSize.height -
        this.mapSize.height / 2 +
        this.cellSize.height / 2,
    };

    const isStart =
      exportedCell.isPath && exportedCell.isEntry && !this.wasStartMarked
        ? true
        : false;
    const isEnd =
      exportedCell.isPath && exportedCell.isEntry && this.wasStartMarked
        ? true
        : false;
    if (isStart) {
      this.wasStartMarked = true;
    }
    const baseOptions: Partial<GameCellOptions> = {
      isPath: exportedCell.isPath,
      isStart,
      isEnd,
    };
    const options: Partial<GameCellOptions> = {
      ...baseOptions,
      onPicked: this.options.onPicked || undefined,
      onBuiltTowerClicked: this.options.onBuiltTowerClicked || undefined,
      onTowerPlaced: (...args) => this.onTowerPlaced(...args),
    };
    return new GameCell(
      this.scene,
      new CellId(rowIndex, columnIndex),
      position,
      this.cellSize,
      options,
    );
  }

  private createWrapper({ isButton, onClick }: GameMapOptions<GameMap>) {
    const wrapper = this.scene.add
      .rectangle(
        this.mapPosition.x,
        this.mapPosition.y,
        this.mapSize.width,
        this.mapSize.height,
      )
      .setStrokeStyle(2, parseInt("000000", 16))
      .setOrigin(0.5);

    if (isButton) {
      wrapper.setInteractive();
      if (isDefined(onClick)) {
        wrapper.on(Phaser.Input.Events.POINTER_UP, () => {
          onClick(this);
        });
      }
      wrapper.on(Phaser.Input.Events.POINTER_OVER, () => {
        wrapper.setStrokeStyle(2, Color.Success);
      });
      wrapper.on(Phaser.Input.Events.POINTER_OUT, () => {
        wrapper.setStrokeStyle(2, Color.Contour);
      });
    }

    return wrapper;
  }
}
