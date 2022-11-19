export default function wordle() {
  return (
    <div id="screen">
      <h1>Wordle</h1>
      <Grid />
      <Keyboard />
    </div>
  );
}

function Grid() {
  return <div id="grid"></div>;
}

function Keyboard() {
  return <div id="keyboard"></div>;
}
