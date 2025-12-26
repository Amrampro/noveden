// client/src/pages/admin/AdminLayout.tsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Star, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Settings, 
  Bell,
  Search,
  LogOut,
  Menu,
  ChevronRight,
  X // Import de l'icône de fermeture
} from "lucide-react";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Fermer la sidebar automatiquement lors d'un changement de route (navigation)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const navSections = [
    {
      title: "Vue d'ensemble",
      items: [
        { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true }, 
      ]
    },
    {
      title: "Gestion Boutique",
      items: [
        { to: "/admin/products", label: "Produits", icon: Package },
        { to: "/admin/product-categories", label: "Catégories", icon: ShoppingBag },
        { to: "/admin/product-reviews", label: "Avis produits", icon: Star },
      ]
    },
    {
      title: "Contenu & Marketing",
      items: [
        { to: "/admin/blog-posts", label: "Articles de blog", icon: FileText },
        { to: "/admin/blog-categories", label: "Catégories blog", icon: MessageSquare },
        { to: "/admin/banners", label: "Bannières", icon: ImageIcon },
        { to: "/admin/faqs", label: "FAQ", icon: HelpCircle },
      ]
    },
    {
      title: "Configuration",
      items: [
        { to: "/admin/legal-links", label: "Pages légales", icon: LinkIcon },
        { to: "/admin/parameters", label: "Paramètres", icon: Settings },
      ]
    }
  ];

  const getCurrentPageTitle = () => {
    const allItems = navSections.flatMap(section => section.items);
    const currentItem = allItems.find(item => item.to === location.pathname);
    return currentItem ? currentItem.label : "Tableau de bord";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-slate-900 overflow-hidden">
      
      {/* --- OVERLAY MOBILE (Fond sombre) --- */}
      {/* S'affiche uniquement si la sidebar est ouverte ET qu'on est sur mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 shadow-xl md:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:flex md:flex-col
        `}
      >
        {/* Logo & Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <LayoutDashboard size={20} />
            </div>
            <span>AdminPanel</span>
          </div>
          {/* Bouton fermeture (visible uniquement sur mobile) */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className={isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"} />
                          {item.label}
                        </div>
                        {isActive && <ChevronRight size={16} className="text-indigo-400" />}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Header */}
        <header className="h-16 bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shadow-sm">
            {/* Titre & Menu Burger */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-gray-500 hover:text-gray-900 p-2 -ml-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                 {getCurrentPageTitle()}
              </h2>
            </div>

            {/* Actions Droite */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Recherche (cachée sur mobile) */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="h-10 w-64 rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Icone Recherche Mobile (visible uniquement sur petit écran) */}
              <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Search size={20} />
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
              </button>
              
              {/* Profil */}
              <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-gray-200">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-800">Admin</div>
                  <div className="text-xs text-gray-500">Superviseur</div>
                </div>
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 cursor-pointer hover:ring-2 hover:ring-indigo-200 transition-all shrink-0">
                  A
                </div>
              </div>
            </div>
        </header>

        {/* Zone de contenu (Outlet) */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}