const OFFICIAL_LOGO = "/image/OFFICIAL%20LOGO.png";
const LIGHT_LOGO = "/image/OFFICIAL%20LOGO%20LIGHT.png";

export default function BrandLogo({ className = "" }) {
  return (
    <span className={`brand-logo ${className}`}>
      <img
        className="brand-logo-original"
        src={OFFICIAL_LOGO}
        alt="Wilgen.dev — Full Stack Developer"
        width="1774"
        height="611"
      />
      <img
        className="brand-logo-light"
        src={LIGHT_LOGO}
        alt=""
        aria-hidden="true"
        width="2137"
        height="736"
      />
    </span>
  );
}
