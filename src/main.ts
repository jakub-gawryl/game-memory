import SceneManager from "./core/SceneManager";
import { Main } from "./scenes/Main";
import { Loading } from "./scenes/Loading";

const sceneManager = new SceneManager();

await sceneManager.init({
  background: "#A2D8FF"
});

await sceneManager.switchScene(Loading);
await sceneManager.switchScene(Main);
