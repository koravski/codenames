import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";



export default function Header() {

  return (
    <div className="header-cont">
      <div className="text-xl font-bold p-3">
      <Link href="/">
           Codenames
       </Link>
      </div>
    </div>
  );
}
