import { React } from "react";
import Image from "next/image";
import { LogoutIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

function NavBar() {
  const router = useRouter();
  return (
    <div className="h-20 flex items-center justify-between shadow-md px-4">
      <div
        onClick={() => {
          router.push("/");
        }}
        className="flex items-center cursor-pointer active:scale-95 transition-all"
      >
        <Image
          src="/images/cuq-logo.png"
          className="rounded-full cursor-pointer active:scale-95 transition-all"
          width="60px"
          height="60px"
        />
        <p className="ml-3 font-semibold text-2xl leading-7 text-primary logo tracking-wide">
          Chandigarh University <br /> Quiz Dashboard
        </p>
      </div>

      <p
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          setTimeout(() => {
            router.push("/").then(() => {router.reload()});;
          }, 500);

        }}
        className="flex items-center cursor-pointer active:scale-95 duration-150"
      >
        <LogoutIcon className="h-8 text-primary mr-1" />
        Logout
      </p>
    </div>
  );
}

export default NavBar;
