import SideNavLeft from "../components/SideNavLeft";

export default function Home() {
  return (
    <div className="flex">
        <SideNavLeft />
      <div className="p-7">
        <h1 className="text-2x1 font-semibold">Home Page</h1>
      </div>
    </div>
  );
}
