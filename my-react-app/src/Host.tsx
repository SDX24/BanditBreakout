import "./Host.css";
import titleBackground from "./assets/title background.png";
import pole from "./assets/post.png";
import host from "./assets/code.png";

function Host() {
  return (
    <div className="host-container">
      <img
        src={titleBackground}
        className="title-background"
        alt="title background"
      />

      <img src={pole} className="pole" alt="pole" />

      <img src={host} className="host" alt="host" />
      <a href="">
        <p className="host-text">Host</p>
      </a>

      <img src={host} className="host" alt="host" />
      <a href="">
        <p className="join-text">Join</p>
      </a>
    </div>
  );
}

export default Host;
