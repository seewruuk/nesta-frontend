"use client";

import React, { useContext, useEffect, useState } from "react";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import { AuthContext } from "@/context/AuthContext";
import DashboardElement from "@/components/DashboardElement";
import Debugger from "@/components/Debugger";
import Image from "next/image";
import { ImageUrl } from "@/lib/imageUrl";

export default function UploadImages({ appId }) {
    const { accessToken } = useContext(AuthContext);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [appImages, setAppImages] = useState([]);

    // Prosta zmienna pochodna zamiast useMemo
    const canUpload =
        Boolean(appId) && Boolean(accessToken) && selectedFiles.length > 0 && !isUploading;

    const onFilesChange = (e) => {
        const files = Array.from(e.target.files || []);
        // Filtr opcjonalny: tylko obrazki
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));
        if (imageFiles.length !== files.length) {
            toast("Niektóre pliki odrzucono — dozwolone są tylko obrazy.");
        }
        setSelectedFiles(imageFiles);
    };

    const clearSelection = () => setSelectedFiles([]);

    // Funkcja odświeżająca pobiera obrazy na podstawie przekazanych argumentów
    async function refreshImages(aid, token) {
        if (!aid || !token) return;
        try {
            const res = await fetch(`/api/apartments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken: token, id: aid }),
            });
            const data = await res.json();

            if (data.status === 401) {
                toast.error("Brak dostępu. Sprawdź swój token dostępu.");
                return;
            }

            setAppImages(Array.isArray(data?.apartment?.images) ? data.apartment.images : []);
        } catch (err) {
            toast.error(`Błąd przy pobieraniu danych mieszkania: ${err?.message || String(err)}`);
        }
    }

    const handleUploadImages = async () => {
        if (!appId) {
            toast.error("Brak appId — najpierw utwórz mieszkanie.");
            return;
        }
        if (!accessToken) {
            toast.error("Brak accessToken — zaloguj się ponownie.");
            return;
        }
        if (!selectedFiles.length) {
            toast.error("Nie wybrano żadnych plików.");
            return;
        }

        setIsUploading(true);
        try {
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("apartmentId", String(appId));
                formData.append("accessToken", String(accessToken));

                const res = await fetch("/api/apartments/upload-image", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (data.status === 200) {
                    toast.success(`Wysłano: ${file.name}`);
                } else {
                    toast.error(`Błąd przy ${file.name}: ${data?.message || "Nieznany błąd"}`);
                }
            }
            clearSelection();

            // Po wysyłce odśwież listę
            await refreshImages(appId, accessToken);
        } catch (err) {
            toast.error(`Błąd podczas wysyłki: ${err?.message || String(err)}`);
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        if (appId && accessToken) {
            refreshImages(appId, accessToken);
        }
    }, [appId, accessToken]);

    // Po usunięciu obrazka odświeżamy listę
    const handleDeleteImage = () => {
        refreshImages(appId, accessToken);
    };

    return (
        <>

            <DashboardElement>
                <div className="flex-col gap-4">
                    <div>
                        <h3 className="text-[18px] font-semibold">Dodaj zdjęcia</h3>
                        <p className="text-sm text-gray-600">
                            Zdjęcia można dodać tylko do istniejącego mieszkania. Aktualne <code>appId</code>:{" "}
                            <span className="font-mono">{appId ?? "—"}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={onFilesChange}
                            disabled={!appId || isUploading}
                            className="block w-full text-sm text-gray-900
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-gray-100 file:text-gray-700
                     hover:file:bg-gray-200 disabled:opacity-50"
                        />

                        {selectedFiles.length > 0 && (
                            <ul className="list-disc list-inside text-sm text-gray-700">
                                {selectedFiles.map((f, i) => (
                                    <li key={`${f.name}-${i}`}>
                                        {f.name} <span className="text-gray-500">({Math.round(f.size / 1024)} KB)</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                style="secondary"
                                title="Wyczyść listę"
                                onClick={clearSelection}
                                disabled={isUploading || selectedFiles.length === 0}
                            />
                            <Button
                                type="button"
                                style="black"
                                title={isUploading ? "Wysyłanie..." : "Wyślij zdjęcia"}
                                onClick={handleUploadImages}
                                disabled={!canUpload}
                            />
                        </div>

                        {!appId && (
                            <p className="text-xs text-red-600">
                                * Brak <code>appId</code>. Zapisz/utwórz mieszkanie, aby móc dodać zdjęcia.
                            </p>
                        )}
                    </div>
                </div>
            </DashboardElement>

            {appImages && appImages.length > 0 && (
                <DashboardElement>
                    <div className="flex-col gap-4">
                        <div className="mb-2">
                            <h3 className="text-[18px] font-semibold">Przesłane zdjęcia</h3>
                            <p className="text-sm text-gray-600">Dotychczas przesłane zdjęcia dla mieszkania.</p>
                        </div>

                        {/* Pięknie ostylowana siatka galerii */}
                        <GalleryGrid images={appImages} onDelete={handleDeleteImage} appId={appId} />
                    </div>
                </DashboardElement>
            )}
        </>
    );
}

const TrashIcon = ({ className = "h-5 w-5" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
    >
        <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9Zm2 2h2v1h-2V5ZM8 7h8v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7Zm2.75 3a.75.75 0 0 0-.75.75v7.5a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75ZM14 10a.75.75 0 0 0-.75.75v7.5a.75.75 0 0 0 1.5 0v-7.5A.75.75 0 0 0 14 10Z" />
    </svg>
);

function GalleryTile({ img, index, onDelete, appId }) {
    const {accessToken} = useContext(AuthContext);
    const src = ImageUrl(img.publicUrl);

    const handleDelete = async (imageId) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await fetch(`${baseUrl}/api/apartments/delete-image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    apartmentId: appId,
                    imageId: imageId,
                }),
            });

            if (response.status === 200) {
                toast.success("Zdjęcie usunięte");
                if (onDelete) onDelete(img, index);
            } else {
                toast.error(data.message || "Błąd przy usuwaniu zdjęcia");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div
            className="group relative aspect-square w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm transition hover:shadow-lg"
            title={`Zdjęcie ${index + 1}`}
        >
            <Image
                src={src}
                alt={img?.alt || `Zdjęcie mieszkania ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                priority={index < 4}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

            <button
                type="button"
                aria-label="Usuń zdjęcie"
                onClick={() => handleDelete(img.id)}
                className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full bg-black/60 p-2 text-white opacity-0 ring-1 ring-white/20 transition focus:opacity-100 focus:outline-none group-hover:opacity-100 hover:bg-black/70"
            >
                <TrashIcon className="h-4 w-4" />
            </button>

            <span className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-blue-500/0 focus-within:ring-2" />
        </div>
    );
}

function GalleryGrid({ images, onDelete, appId }) {
    if (!images?.length) return null;

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((img, i) => (
                <GalleryTile key={img?.id ?? i} img={img} index={i} onDelete={onDelete} appId={appId} />
            ))}
        </div>
    );
}
