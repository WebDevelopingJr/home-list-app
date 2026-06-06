import Image, { StaticImageData } from "next/image"
import { useEffect, useState } from "react"

type StateAviable = 'Aviable' | 'Low stock' | 'No stock'
type CheckElements = 'styles' | 'images'

type ListDb = {
  id: ReturnType<typeof crypto.randomUUID>,
  name: string,
  type: string,
  brand: string | null,
  store?: string,
  image?: string,
  amount: number,
  maxAmount: number,
  avb: StateAviable
}

type ItemListProps = {
  showArrList: ListDb[],
  arrInfo: any,
  setImageOpen: (id: string) => void,
  setOpenImageContainer: (val: boolean) => void,
  setShowImagePanel: (val: boolean) => void,
  setElementListImage: (el: ListDb) => void,
  setItemToEdit: (el: ListDb) => void,
  setShowEditPanel: (val: [boolean, ListDb]) => void,
  deleteListElement: (id: ReturnType<typeof crypto.randomUUID>) => void,
  giveStockDeclarations: (state: StateAviable, type: CheckElements) => any,
  giveBarStyles: (state: StateAviable) => string,
  defaultImage: StaticImageData,
  openImageIcon: StaticImageData,
  addImgIcon: StaticImageData,
  editIconList: StaticImageData,
  deleteList: StaticImageData,
}


export function useIsMobile(breakpoint = 1060) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}


export function ItemListDevice({ showArrList, arrInfo, setImageOpen, setOpenImageContainer, setShowImagePanel, setElementListImage, setItemToEdit, setShowEditPanel, deleteListElement, giveStockDeclarations, giveBarStyles, defaultImage, openImageIcon, addImgIcon, editIconList, deleteList }: ItemListProps) {
  return (
    <>
      {showArrList.map((el, inx) => (
        <div className="w-full flex justify-between bg-gray-400/10 px-8 py-3 relative border-t border-gray-400/60 hover:bg-gray-400/20 transition duration-100" key={`${el.name} ${inx}`}>
          <div className="flex items-center justify-center pr-5 mr-5 border-r border-gray-500">
            {el.image !== undefined ? (
              <img
                src={`https://ylduecmgivurnnlcskus.supabase.co/storage/v1/object/public/listItems/${arrInfo.id}/${el.image}`}
                alt="product"
                className="w-20 h-15 rounded-2xl shadow-2xl cursor-pointer"
                onClick={() => { setImageOpen(el.image!); setOpenImageContainer(true) }}
              />
            ) : (
              <Image src={defaultImage} alt="defaultImage" className="w-20 h-fit" />
            )}
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <h1 className="text-lg">{el.name}</h1>
            <div className="flex gap-2">
              {el.brand !== null && (
                <p className="w-auto text-center py-1 px-4 rounded-lg text-sm bg-gray-500 text-gray-50">{el.brand}</p>
              )}
              <p className="w-auto text-center py-1 px-4 rounded-lg text-sm bg-gray-500 text-gray-50">{el.type}</p>
              {el.store !== '' && (
                <p className="w-auto text-center py-1 px-4 rounded-lg text-sm bg-gray-500 text-gray-50">{el.store}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1">
            <p className="font-semibold">{el.amount}</p>
            <p className="text-sm text-gray-600 font-semibold">of {el.maxAmount}</p>
          </div>

          <div className="flex items-center justify-center gap-5">
            <div className="w-50 flex items-center justify-center">
              <div className="w-full flex flex-row-reverse items-center gap-2">
                <div className="w-full h-2 bg-gray-400 rounded-xl overflow-hidden flex items-center justify-start">
                  <div className={`h-10 ${giveBarStyles(el.avb)}`} style={{ width: `${Math.floor((el.amount / el.maxAmount) * 100)}%` }} />
                </div>
                <p className="text-sm text-gray-800">{Math.floor((el.amount / el.maxAmount) * 100)}%</p>
              </div>
            </div>

            <button className={`w-30 h-8 text-sm flex items-center justify-center gap-1 pr-2 ${giveStockDeclarations(el.avb, 'styles')}`}>
              <Image src={giveStockDeclarations(el.avb, 'images')} alt="stock" width={20} /> {el.avb}
            </button>

            {el.image !== undefined ? (
              <div className="cursor-pointer" onClick={() => { setImageOpen(el.image!); setOpenImageContainer(true) }}>
                <Image src={openImageIcon} alt="openImage" />
              </div>
            ) : (
              <div className="cursor-pointer" onClick={() => { setShowImagePanel(true); setElementListImage(el) }}>
                <Image src={addImgIcon} alt="addImage" />
              </div>
            )}

            <div className="cursor-pointer" onClick={() => { setItemToEdit(el); setShowEditPanel([true, el]) }}>
              <Image src={editIconList} alt="edit" />
            </div>
            <div className="cursor-pointer" onClick={() => deleteListElement(el.id)}>
              <Image src={deleteList} alt="delete" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export function ItemListPhone({ showArrList, arrInfo, setImageOpen, setOpenImageContainer, setShowImagePanel, setElementListImage, setItemToEdit, setShowEditPanel, deleteListElement, giveStockDeclarations, giveBarStyles, defaultImage, openImageIcon, addImgIcon, editIconList, deleteList }: ItemListProps) {
  return (
    <>
      {showArrList.map((el, inx) => (
        <div className="w-full flex flex-col bg-gray-400/10 px-5 py-4 border-t border-gray-400/60" key={`${el.name} ${inx}`}>

          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">{el.name}</h1>
            <button className={`h-7 px-3 text-xs flex items-center gap-1 ${giveStockDeclarations(el.avb, 'styles')}`}>
              <Image src={giveStockDeclarations(el.avb, 'images')} alt="stock" width={14} /> {el.avb}
            </button>
          </div>

          <div className="flex gap-2 mt-2 flex-wrap">
            <p className="py-0.5 px-3 rounded-lg text-xs bg-gray-500 text-gray-50">{el.brand}</p>
            <p className="py-0.5 px-3 rounded-lg text-xs bg-gray-500 text-gray-50">{el.type}</p>
            {el.store !== '' && (
              <p className="py-0.5 px-3 rounded-lg text-xs bg-gray-500 text-gray-50">{el.store}</p>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <p className="text-sm font-semibold">{el.amount} <span className="text-gray-500 font-normal">of {el.maxAmount}</span></p>
            <div className="flex-1 h-2 bg-gray-400 rounded-xl overflow-hidden">
              <div className={`h-10 ${giveBarStyles(el.avb)}`} style={{ width: `${Math.floor((el.amount / el.maxAmount) * 100)}%` }} />
            </div>
            <p className="text-xs text-gray-600">{Math.floor((el.amount / el.maxAmount) * 100)}%</p>
          </div>

          <div className="flex items-center justify-end gap-3 mt-3">
            {el.image !== undefined ? (
              <div className="cursor-pointer p-2 bg-white rounded-xl" onClick={() => { setImageOpen(el.image!); setOpenImageContainer(true) }}>
                <Image src={openImageIcon} alt="openImage" width={18} />
              </div>
            ) : (
              <div className="cursor-pointer p-2 bg-white rounded-xl" onClick={() => { setShowImagePanel(true); setElementListImage(el) }}>
                <Image src={addImgIcon} alt="addImage" width={18} />
              </div>
            )}
            <div className="cursor-pointer p-2 bg-white rounded-xl" onClick={() => { setItemToEdit(el); setShowEditPanel([true, el]) }}>
              <Image src={editIconList} alt="edit" width={18} />
            </div>
            <div className="cursor-pointer p-2 bg-white rounded-xl" onClick={() => deleteListElement(el.id)}>
              <Image src={deleteList} alt="delete" width={18} />
            </div>
          </div>

        </div>
      ))}
    </>
  )
}