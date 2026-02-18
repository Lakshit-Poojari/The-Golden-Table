import React, { useEffect, useState } from "react";
import MenuAxios from "../../API/MenuAxios/MenuAxios";
import "./Menu.css"

function Menu() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await MenuAxios.get("active/");
      setMenu(res.data);
    } catch (err) {
      setMenu(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading menu...</p>;

  if (!menu) return <p>Menu not available</p>;

  return (
    <>
      <div className="menu-page">
        
          <h1>Our Menu</h1>
        
          <p className="menu-subtitle">
        Explore our carefully curated selection of dishes
      </p>
        <div className="menu-card">
          <p>
          View our complete menu with detailed dishes and prices.
        </p>
          <a
            href={menu.pdf}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            View Menu (PDF)
          </a>
        </div>
      </div>
    </>
  );
}

export default Menu;
