import DashboardLayout from "@/components/_layouts/DashboardLayout";

export default function layout({children}) {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>

    );
}