import { Logo } from "./Logo";
import { Menu } from "./Menu";

export const Navbar = ({ user }) => {
  return (
    <nav className="navbar">
      <Logo />
      <Menu user={user}/>
    </nav>
  );
};
