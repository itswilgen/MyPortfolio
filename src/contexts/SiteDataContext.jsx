import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getPublicCertificates, getPublicPaymentProofs, getPublicProfile, getPublicProjects, getPublicSettings } from "../services/contentService";

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [state, setState] = useState({ profile: null, projects: [], certificates: [], paymentProofs: [], settings: {}, loading: true, error: "" });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const [profile, projects, certificates, paymentProofs, settings] = await Promise.all([
        getPublicProfile(), getPublicProjects(), getPublicCertificates(), getPublicPaymentProofs(), getPublicSettings(),
      ]);
      setState({ profile, projects, certificates, paymentProofs, settings, loading: false, error: "" });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message }));
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  const value = useMemo(() => ({ ...state, refresh }), [refresh, state]);
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const value = useContext(SiteDataContext);
  if (!value) throw new Error("useSiteData must be used inside SiteDataProvider");
  return value;
}
