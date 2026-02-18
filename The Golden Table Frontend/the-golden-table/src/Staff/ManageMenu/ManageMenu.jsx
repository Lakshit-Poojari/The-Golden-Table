import React, { useState } from 'react'
import MenuAxios from '../../API/MenuAxios/MenuAxios';
import { useNavigate } from 'react-router-dom';
import "./ManageMenu.css"

function ManageMenu() {
    const [file, setfile] = useState(null);
    const [loading, setloading] = useState(false);
    const [currentmenu, setcurrentmenu] = useState(null)
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selected = e.target.files[0]
        if(!selected){
            return
        }

        if (selected.type !== "application/pdf") {
            alert("only PDF file are allowed")
            return
        }

        setfile(selected);
    }

    const uploadMenu =async() =>{
        if (!file) {
            alert("Select a pdf file")
            return
        }

        const formData = new FormData();
        formData.append("title", "Restaurant Menu");
        formData.append("menu_pdf", file);

    try {
      setloading(true);
      await MenuAxios.post("upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Menu uploaded successfully");
      setfile(null);
      fetchCurrentMenu();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setloading(false);
    }
  };

  const fetchCurrentMenu = async () => {
    try {
      const res = await MenuAxios.get("active/");
      setcurrentmenu(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="staff-page">
          <h1>Booking List</h1>
          <button className='form-control'  onClick={() => navigate("/staff/dashboard")}>
            ← Back to Dashboard
          </button>
          <div className='upload-card'>
              <h3>Upload Menu PDF</h3>

              <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className='form-control file-input'
              />

              <button onClick={uploadMenu} className='form-control ' disabled={loading}>
                  {loading ? "Uploading..." : "Upload"}
              </button>

              {currentmenu && (
                  <div >
                  <p>Current Menu:</p>
                  <a href={currentmenu.pdf} target="_blank" rel="noreferrer">
                      View Menu
                  </a>
                  </div>
              )}
          </div>
        </div>
    </>
  )
}


export default ManageMenu