/* eslint-disable @next/next/no-html-link-for-pages */
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-6 bg-blue-500 text-white">
      <a href="/" className="text-lg font-bold">
        Logo
      </a>
      <div>
        <a href="/" className="p-2">
          Home
        </a>
        <a href="/about" className="p-2">
          About
        </a>
        <a href="/contact" className="p-2">
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
