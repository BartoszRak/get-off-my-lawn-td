import { Position, Size } from "../../../utils";
import { RawColor } from "../../Color";

export class BankAccount extends Phaser.GameObjects.Group {
  private readonly text: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    fontSize: number,
    padding: number,
    private money = 0
  ) {
    super(scene);

    this.text = this.createText(scene, position, fontSize, padding, money);

    this.addMultiple([this.text]);
  }

  setMoney(money: number) {
    this.money = money;
    const message = this.createMessage(money);
    this.text.setText(message);
  }

  private createMessage(money: number) {
    return `You have: ${money} $`;
  }

  private createText(
    scene: Phaser.Scene,
    position: Position,
    fontSize: number,
    padding: number,
    money: number
  ) {
    const { x, y } = position;
    const text = new Phaser.GameObjects.Text(
      scene,
      x,
      y,
      this.createMessage(money),
      {
        backgroundColor: `#${RawColor.Dark}`,
        color: `#${RawColor.DarkContrast}`,
        fontSize,
        align: "center",
        padding: {
          x: padding,
          y: padding,
        },
      }
    );
    scene.add.existing(text);
    return text;
  }
}
