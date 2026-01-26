"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { menuData } from "./menuData";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import {
  MenuIcon,
  CloseIcon,
} from "./icons";
import { resorts } from "@/assets/resorts";
import { RippleButton } from "@/components/ui/ripple-button";
import { ThemeToggle } from "@/components/ThemeToggle";

type IProps = {
  headerData?: any;
};

const MainHeader = ({ headerData }: IProps) => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const paymentLink = resorts[0]?.paymentLink || "/resorts";

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setNavigationOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header
        className={`left-0 top-0 w-full max-h-[80px] z-50 bg-background transition-all ease-in-out duration-300 ${stickyMenu && "shadow-sm border-b border-background-hover"}`}
      >
        {/* Main Header */}
        <div className="px-3 mx-auto max-w-7xl sm:px-6 xl:px-0 ">
          <div className="flex items-center justify-between py-2">
            {/* Logo */}
            <div>
              <Link className="flex items-center gap-0 shrink-0" href="/">
                  <span className="amwaj-brand-text"> Amwaj Resort&apos;s </span>
                <div className="amwaj-brand-lockup">
                  <Image
                    src="/logo-light.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    priority
                    className="amwaj-brand-mark dark:hidden"
                  />
                  <Image
                    src="/logo-dark.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    priority
                    className="amwaj-brand-mark hidden dark:block"
                  />
                
                </div>
              </Link>
            </div>

            {/* Desktop Menu - Hidden on mobile */}
            <div className="hidden xl:block">
              <DesktopMenu menuData={menuData} stickyMenu={stickyMenu} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              <RippleButton
                onClick={() => {
                  if (paymentLink.startsWith("http")) {
                    window.open(paymentLink, "_blank");
                  } else {
                    window.location.href = paymentLink;
                  }
                }}
                className="hidden sm:inline-flex bg-black text-white border-2 border-white"
                rippleColor="rgba(120, 183, 225, 0.6)"
              >
                احجز الآن
              </RippleButton>

              {/* Mobile Menu Toggle */}
              <button
                className="transition xl:hidden focus:outline-none text-white"
                onClick={() => setNavigationOpen(!navigationOpen)}
                aria-label={navigationOpen ? "Close menu" : "Open menu"}
              >
                {navigationOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Offcanvas */}
      <MobileMenu
        headerLogo={headerData?.headerLogo || null}
        isOpen={navigationOpen}
        onClose={() => setNavigationOpen(false)}
        menuData={menuData}
      />
    </>
  );
};

export default MainHeader;
