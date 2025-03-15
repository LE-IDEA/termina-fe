import Image from 'next/image'
import { Geologica } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const SearchAdd = () => {
  return (
    <section className='flex flex-row w-full gap-3'>
      <div className='flex flex-row flex-1 bg-[#ebebeb] p-[18px] gap-3 rounded-[24px]'>
        <Image src="/SearchFrame.svg" alt='search' width={28} height={28} />
        <input
          value="" id="search" className={`${geologica.className} bg-[#ebebeb] font-normal text-[20px] leading-1 tracking-normal`} placeholder="Search" title="Search">

        </input>

      </div>

      <div className='bg-[#ebebeb] p-[18px] rounded-[24px]'>
        <Image src="/Plus.svg" alt='add' width={28} height={28} />
      </div>
    </section>
  )
}

export default SearchAdd