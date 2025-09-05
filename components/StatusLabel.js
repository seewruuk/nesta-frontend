export default function StatusLabel({status, className = ""}) {
    const labelsStyles = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
        CANCELLED: "bg-gray-100 text-gray-800",
    }

    return (<span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${labelsStyles[status] || 'bg-gray-100 text-gray-800'} ${className}`}>
            {status}
        </span>)
}