import { useState, useEffect } from 'react'
import Footer from './componnens/Footer';

const App = () => {
  const [data, setData] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [quantityValue, setQuantityValue] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [showModal, setShowModal] = useState(false); // State untuk mengontrol modal

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('data'));
    if (savedData) {
      setData(savedData);
    }
    const interval = setInterval(() => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      setBackgroundColor(randomColor);
    }, 1000); // Ganti warna latar setiap 1 detik
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = e.target.elements.data.value;
    const newQuantity = e.target.elements.quantity.value;
    setData([...data, { name: newData, quantity: newQuantity, checked: false }]);
    setInputValue('');
    setQuantityValue('');
    localStorage.setItem('data', JSON.stringify([...data, { name: newData, quantity: newQuantity, checked: false }]));
  }

  const handleFinish = () => {
    setShowModal(true); // Menampilkan modal saat tombol "Selesai" diklik
  }

  const handleModalConfirm = () => {
    setData([]); // Menghapus data saat tombol "Sudah" di klik
    localStorage.removeItem('data');
    setShowModal(false); // Menutup modal setelah menghapus data
    window.location.reload(); // Merefresh browser
  }

  const handleCheckboxChange = (index) => {
    const updatedData = [...data];
    updatedData[index].checked = !updatedData[index].checked;
    setData(updatedData);

    const completedItem = updatedData.find((item) => item.checked);
    if (completedItem) {
      setCompleteData([...completeData, completedItem]);
      setData(updatedData.filter((item) => !item.checked));
    }

    localStorage.setItem('data', JSON.stringify(updatedData));
  }

  return (
    <>
      <div className='transition-all duration-1000' style={{ backgroundColor: backgroundColor }}>

        <div className="flex flex-col items-center justify-center" >
          <h1 className='text-white text-4xl my-4'>Belanja apa aja?</h1>
          <form onSubmit={handleSubmit} className="mb-4 grid">
            <input
              type="text"
              id='data'
              placeholder='Masukan Nama Barang'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="p-2 bg-slate-800 border border-gray-300 rounded mr-2 text-white my-2"
            />
            <input
              type="text"
              id='quantity'
              placeholder='Masukan Jumlah'
              value={quantityValue}
              onChange={(e) => setQuantityValue(e.target.value)}
              className="p-2 bg-slate-800 border border border-gray-300 rounded mr-2 text-white"
            />
            <div className="flex justify-center">
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-4 px-6  rounded">Oke</button>
            </div>
          </form>

          <table className="mb-4 m-4 text-white">
            <thead>
              <tr>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="text-white">{item.name}</td>
                  <td className="text-white">{item.quantity}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="mb-4 m-4 text-white">
            <thead>
              <tr>
                <th>Barang</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {completeData.map((item, index) => (
                <tr key={index}>
                  <td className="text-white">{item.name}</td>
                  <td className="text-white">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-4 rounded animate__animated animate__fadeIn">
                <p className="text-lg font-bold mb-4">Sudah selesai semua?</p>
                <div className="flex justify-end">
                  <button onClick={handleModalConfirm} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Sudah</button>
                </div>
              </div>
            </div>
          )}

          <button onClick={handleFinish} className="w-60 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded bottom-0 m-4">Selesai</button>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App
