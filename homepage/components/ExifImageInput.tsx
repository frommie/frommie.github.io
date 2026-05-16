import { useEffect, useCallback, useRef } from 'react'
import { ImageInput, set, setIfMissing, unset } from 'sanity'
import type { ImageInputProps } from 'sanity'

export function ExifImageInput(props: ImageInputProps) {
  const { onChange } = props
  const attachedInputs = useRef(new WeakSet<HTMLInputElement>())

  const extractAndPatch = useCallback(async (file: File) => {
    try {
      const exifr = (await import('exifr')).default
      const exif = await exifr.parse(file, {
        pick: [
          'Make', 'Model', 'LensModel',
          'FocalLength', 'FNumber',
          'ExposureTime', 'ISO',
          'DateTimeOriginal',
        ],
      })

      if (!exif) return

      const shutterSpeed = exif.ExposureTime
        ? exif.ExposureTime < 1
          ? `1/${Math.round(1 / exif.ExposureTime)}s`
          : `${exif.ExposureTime}s`
        : null

      onChange([
        setIfMissing({}, ['exif']),
        exif.Make        ? set(exif.Make, ['exif', 'make'])               : unset(['exif', 'make']),
        exif.Model       ? set(exif.Model, ['exif', 'model'])             : unset(['exif', 'model']),
        exif.LensModel   ? set(exif.LensModel, ['exif', 'lens'])          : unset(['exif', 'lens']),
        exif.FocalLength ? set(exif.FocalLength, ['exif', 'focalLength']) : unset(['exif', 'focalLength']),
        exif.FNumber     ? set(`f/${exif.FNumber}`, ['exif', 'aperture']) : unset(['exif', 'aperture']),
        shutterSpeed     ? set(shutterSpeed, ['exif', 'shutterSpeed'])     : unset(['exif', 'shutterSpeed']),
        exif.ISO         ? set(exif.ISO, ['exif', 'iso'])                 : unset(['exif', 'iso']),
        exif.DateTimeOriginal
          ? set(exif.DateTimeOriginal.toISOString(), ['exif', 'takenAt'])
          : unset(['exif', 'takenAt']),
      ])
    } catch (e) {
      console.warn('EXIF-Extraktion fehlgeschlagen:', e)
    }
  }, [onChange])

  useEffect(() => {
    // ── File-Input (Klick-Upload) ──────────────────────────────────
    const tryAttach = () => {
      document
        .querySelectorAll<HTMLInputElement>('input[type="file"]')
        .forEach((input) => {
          if (attachedInputs.current.has(input)) return
          attachedInputs.current.add(input)
          input.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) extractAndPatch(file)
          })
        })
    }

    tryAttach()
    const observer = new MutationObserver(tryAttach)
    observer.observe(document.body, { childList: true, subtree: true })

    // ── Drag & Drop ───────────────────────────────────────────────
    const handleDrop = (e: DragEvent) => {
      const file = e.dataTransfer?.files?.[0]
      if (file?.type.startsWith('image/')) extractAndPatch(file)
    }

    // Capture-Phase: wir lesen die Datei bevor Sanity den Drop verarbeitet
    document.addEventListener('drop', handleDrop, true)

    return () => {
      observer.disconnect()
      document.removeEventListener('drop', handleDrop, true)
    }
  }, [extractAndPatch])

  return <ImageInput {...props} />
}
