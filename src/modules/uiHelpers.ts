export function onElement<T extends Element>(
  selector: string,
  cb: (el: T) => void
) {
  document.querySelectorAll(selector).forEach(el => {
    cb(el as T);
  });
}
