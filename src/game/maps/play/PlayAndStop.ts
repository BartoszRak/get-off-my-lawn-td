import { Position, Size } from "../../../utils";
import { Image } from "../../Image";

export interface PlayAndStopCallbacks {
  onPlay: () => void;
  onStop: () => void;
}

export class PlayAndStop extends Phaser.GameObjects.Group {
  private readonly rectangle: Phaser.GameObjects.Rectangle;
  private readonly button: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    private readonly position: Position,
    private readonly size: Size,
    private isStopped = true,
    private readonly callbacks: Partial<PlayAndStopCallbacks> = {},
  ) {
    super(scene);

    const { x, y } = this.position;
    const { width, height } = this.size;

    this.rectangle = this.scene.add.rectangle(x, y, width, height);

    const sources = this.getRightImages(isStopped);
    const onClick = this.getRightOnClick(isStopped);
    this.button = this.createButton(...sources, onClick);
    this.attachButtonCallbacks(...sources, onClick);

    this.addMultiple([this.rectangle, this.button]);
  }

  onPlay() {
    this.isStopped = false;
    this.refreshButton(this.isStopped);
    const { onPlay } = this.callbacks;
    if (onPlay) {
      onPlay();
    }
  }

  onStop() {
    this.isStopped = true;
    this.refreshButton(this.isStopped);
    const { onStop } = this.callbacks;
    if (onStop) {
      onStop();
    }
  }

  private refreshButton(isStopped: boolean) {
    const sources = this.getRightImages(isStopped);
    const onClick = this.getRightOnClick(isStopped);
    this.button.setTexture(sources[1]);

    this.cleanupButtonCallbacks();
    this.attachButtonCallbacks(...sources, onClick);
  }

  private createButton(image: Image, activeImage: Image, onClick: () => void) {
    const { x, y } = this.position;
    const { width, height } = this.size;
    const button = new Phaser.GameObjects.Image(this.scene, x, y, image)
      .setDisplaySize(width, height)
      .setInteractive({
        cursor: "url(assets/cursor_hand.png), default",
      });

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanupButtonCallbacks();
    });
    this.scene.add.existing(button);

    return button;
  }

  private getRightImages(isStopped: boolean): [Image, Image] {
    return isStopped
      ? [Image.Play, Image.PlayFull]
      : [Image.Stop, Image.StopFull];
  }

  getRightOnClick(isStopped: boolean): () => void {
    return isStopped ? () => this.onPlay() : () => this.onStop();
  }

  private attachButtonCallbacks(
    image: Image,
    activeImage: Image,
    onClick: () => void,
  ) {
    this.button.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.button.setTexture(activeImage).setTintFill(parseInt("00FF00", 16));
    });
    this.button.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.button.setTexture(image).clearTint();
    });
    this.button.on(Phaser.Input.Events.POINTER_UP, () => {
      onClick();
    });
  }

  private cleanupButtonCallbacks() {
    this.button.off(Phaser.Input.Events.POINTER_OVER);
    this.button.off(Phaser.Input.Events.POINTER_OUT);
    this.button.off(Phaser.Input.Events.POINTER_UP);
  }
}
