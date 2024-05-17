import Tag from "@/components/Tag";
import SliderOverShort from "@/components/SliderOverShort";

export default function ModalAddFolders() {
  return (
    <SliderOverShort openModal={false}>
      <Tag onclick={() => setModalC(false)} className="bg-green-500" />
      <div className="bg-gray-300 max-md:w-screen w-96 rounded-l-2xl overflow-y-auto h-screen">
        <div className="m-3 font-medium text-lg">
          <h1>Configurar Folders</h1>
        </div>
        <div className="m-3 py-5 bg-gray-100 rounded-2xl">
          <div className="bg-white px-2">
            <div className="p-3">
              <h1 className="font-medium text-lg">Synchronize folders</h1>
            </div>
            <div className="text-xs">
              <div className="flex ml-2">
                <input type="checkbox" />
                <p className="ml-1">Select all</p>
              </div>
              <div className="mt-4 ml-4">
                {folderData.map((data, index) => (
                  <div className="flex mt-4 ml-2" key={index}>
                    <input
                      type="checkbox"
                      checked={data.state}
                      onChange={(e) => {
                        const newFolderData = [...folderData];
                        newFolderData[index] = {
                          ...newFolderData[index],
                          state: e.target.checked,
                        };
                        setFolderData(newFolderData);
                      }}
                    />
                    <p className="ml-1">{data.folder}</p>
                  </div>
                ))}
              </div>
              <div className="m-3 text-xs my-4 w-80">
                <h1 className="font-medium text-lg border-b-4 border-black pb-1">
                  Folder rules
                </h1>
                <p className="p-2">
                  Save sent emails to folder{" "}
                  <span className="text-cyan-500">INBOX / Sent</span>
                </p>
                <p className="p-2">
                  Move deleted emails to folder{" "}
                  <span className="text-cyan-500">INBOX / Sent</span>
                </p>
                <p className="p-2">
                  Move spam to folder{" "}
                  <span className="text-cyan-500">INBOX / Sent</span>
                </p>
              </div>
              <div className="flex justify-around">
                <button
                  type="button"
                  className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => saveFoldersData()}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => setModalC(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SliderOverShort>
  );
}
