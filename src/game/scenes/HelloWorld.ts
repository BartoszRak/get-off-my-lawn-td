import Phaser from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("helloworld");
  }

  preload() {
    console.log('SCENE: Preload')
    this.load.setBaseURL("https://labs.phaser.io");

    this.load.image("logo", "assets/sprites/phaser3-logo.png");
    this.load.image("red", "assets/particles/red.png");
  }

  create() {
    console.log('SCENE: Create')
    this.createEmitter();
  }

  createEmitter() {
    const particles = this.add.particles(2, 2);

    // const emitter = particles.createEmitter({
    //   speed: 100,
    //   scale: { start: 1, end: 0 },
    //   blendMode: "ADD",
    // });

    const logo = this.physics.add.image(400, 100, "logo");

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    particles.startFollow(logo);
  }

  update(time: number, delta: number): void {
    console.log('SCENE: Update', time, delta)
  }
}
