import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";

import Landing    from "./pages/Landing";
import Login      from "./pages/Login";
import NotFound   from "./pages/NotFound";
import Dashboard  from "./pages/Dashboard";
import Analyse    from "./pages/Analyse";
import Watchlist  from "./pages/Watchlist";
import Simulator  from "./pages/Simulator";
import Advisor    from "./pages/Advisor";
import Learn      from "./pages/Learn";
import Settings   from "./pages/Settings";
import AppShell   from "./components/nav/AppShell";
import RequireAuth from "@/components/auth/RequireAuth";

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      // Show stale data while refetching — never block UI
      staleTime: 60_000,
    },
  },
});

// Wrap all app pages with the nav shell
function AppLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <BrowserRouter>
            <Routes>
              {/* Public pages — no shell */}
              <Route path="/"      element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* Protected app pages — with nav shell */}
              <Route path="/dashboard" element={<RequireAuth><AppLayout><Dashboard /></AppLayout></RequireAuth>} />
              <Route path="/analyse"   element={<RequireAuth><AppLayout><Analyse /></AppLayout></RequireAuth>} />
              <Route path="/watchlist" element={<RequireAuth><AppLayout><Watchlist /></AppLayout></RequireAuth>} />
              <Route path="/simulator" element={<RequireAuth><AppLayout><Simulator /></AppLayout></RequireAuth>} />
              <Route path="/advisor"   element={<RequireAuth><AppLayout><Advisor /></AppLayout></RequireAuth>} />
              <Route path="/learn"     element={<RequireAuth><AppLayout><Learn /></AppLayout></RequireAuth>} />
              <Route path="/settings"  element={<RequireAuth><AppLayout><Settings /></AppLayout></RequireAuth>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
