import Phaser from "phaser";
import { SceneKey } from "../SceneKey";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({
      key: SceneKey.Start,
    });
  }

  preload() {
    // console.log('SCENE: Preload')
    this.load.setBaseURL("https://labs.phaser.io");

    this.load.image("logo", "assets/sprites/phaser3-logo.png");
    this.load.image("red", "assets/particles/red.png");
  }

  create() {
    const { height, width } = this.scale;
    // console.log('SCENE: Create')
    this.createEmitter();
    this.add
      .text(width / 2, height / 2, "Press any KEY to start", {
        fontFamily: '"Lato"',
        fontSize: 30,
        color: "000000",
      })
      .setOrigin(0.5);

    this.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, () =>
      this.startGame()
    );
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN);
    });
  }

  createEmitter() {
    // const particles = this.add.particles(2, 2);

    // const emitter = particles.createEmitter({
    //   speed: 100,
    //   scale: { start: 1, end: 0 },
    //   blendMode: "ADD",
    // });

    const logo = this.physics.add.image(400, 100, "logo");

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    // particles.startFollow(logo);
  }

  update(time: number, delta: number): void {
    // console.log('SCENE: Update', time, delta)
  }

  private startGame() {
    // this.scene.stop()
    this.scene.manager.switch(this.scene.key, SceneKey.MainMenu);
    this.scene.manager.start(SceneKey.MainMenu);
  }
}
