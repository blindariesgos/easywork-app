export default function LoginLayout({ children }) {
  const background = {
    backgroundImage: "url('/img/atom.png')",
    backgroundRepeat: "repeat",
    backgroundColor: "#262261"
  }
  return (
    <div className="h-screen overflow-auto">
      <main
        style={background}  
        className="min-h-screen flex items-center justify-center
      ">
        {children}
      </main>
    </div>
  );
}
