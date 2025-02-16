import Image from "next/image";


export default function CreateAccount() {
  return (
    <>
      <div className="size-full h-screen items-center justify-center bg-black p-[24px]">
        <div className="flex flex-col items-center justify-between h-full  ">

          <div className="flex flex-col items-start  justify-between px-3 gap-[48px]" >
            <div className="mx-1">
              <Image
                src="/accountfile.svg"
                alt='pay'
                width={224}
                height={224}
              />
            </div>

            <div className="flex flex-col gap-[24px] items-center justify-center">
              <h2 className="text-white">create account</h2>

              <div className="flex flex-col gap-3 items-center justify-center ">
                <div className="flex flex-row p-1 gap-1 border border-1 border-solid border-white rounded-lg">
                  <Image
                    src="/Mail.svg" alt="input mail"
                    width={20} height={20}
                  />
                  <input type="text"
                    placeholder="email"
                    className="ml-2 px-2 flex-1 bg-black placeholder:text-white  " />
                </div>
                <button className="text-white bg-[#0077FF] w-[280px] px-[48px] py-[12px] rounded-xl"> <h1 className="font-geologica font-normal text-[16px] leading-[19.2px] tracking-[0%] text-center">continue</h1> </button>
              </div>


              <h1 className="text-white font-geologica font-light text-[16px] leading-[16px] tracking-[0%] text-center">or continue with</h1>
              <button className="text-black flex flex-row bg-white rounded-lg px-2 py-1">
                <Image
                  src="/GoogleG.svg" alt="google"
                  width={20} height={20}
                />
                <h1 className="font-geologica font-normal text-[16px] leading-[19.2px] tracking-[0%] text-center">Google</h1>
              </button>
            </div>
          </div>

          {/* <div> */}
          <h1 className="text-white font-geologica font-light text-[16px] leading-[16px] tracking-[0%] text-center">
            or import existing one
          </h1>
          {/* </div> */}


        </div>
      </div>
    </>
  );
}
