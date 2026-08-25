import { PortfolioDesktop } from "@/components/markos/desktop";
import { appearanceBootstrapScript } from "@/components/markos/appearance";

export default function Home() {
  return (
    <>
      <PortfolioDesktop />
      <script dangerouslySetInnerHTML={{ __html: appearanceBootstrapScript }} />
    </>
  );
}
