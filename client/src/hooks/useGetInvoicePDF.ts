import { useEffect, useState } from "react";
import { selectCurrentToken } from "../features/auth/authSlice"
import { useAppSelector } from "../app/hooks"

interface Payload {
    invoiceId: string | undefined;
    userId: string | undefined;
}

export const useGetInvoicePDF = ({ invoiceId, userId }: Payload) => {
    const token = useAppSelector(selectCurrentToken);
    const domain = import.meta.env.VITE_API_URL;

    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        const getPdf = async () => {
            try {
                setError("");
                setIsLoading(true);
                setIsSuccess(false);
                const response = await fetch(`${domain}/invoice/invoice-pdf?invoiceId=${invoiceId}&userId=${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/pdf"
                    }
                });
                const contentType = response.headers.get("Content-Type");
                if(!response.ok) {
                    if(contentType?.includes("application/json")){
                        const json = await response.json();
                        setError(json.message);
                    }
                    else setError("Failed to fetch pdf");
                    setIsSuccess(false);
                }
                else if(response.ok) {
                    const blob = await response.blob();
                    const bloblUrl = URL.createObjectURL(blob);
                    setUrl(bloblUrl);
                    setIsSuccess(true);
                }
            }
            catch(error){
                console.log(error)
            }
            finally {
                setIsLoading(false);
            }
        }
        getPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { isLoading, isSuccess, error, url }
}