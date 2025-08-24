"use client"
import ActionPopup from "@/components/ActionPopup";
import { useState } from 'react';


export function usePopupController(initial = false) {
 const [open, setOpen] = useState(initial);
 const show = () => setOpen(true);
 const hide = () => setOpen(false);
 const toggle = () => setOpen((s) => !s);
 return { open, show, hide, toggle, setOpen };
}
