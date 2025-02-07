export interface IGameState {
  isClickAllowed(): boolean;

  setBusy(): void;
  setIdle(): void;
}