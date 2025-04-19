export default function DashboardElement({children}){
    return(
        <div className={'bg-white flex flex-col px-[24px] py-[32px] rounded-2xl'}>
            {children}
        </div>
    )
}