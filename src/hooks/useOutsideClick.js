import { useEffect } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideClick(ref, callback, stopProp = false) {
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event) {
			// debugger;
			if (stopProp) {
				event.stopPropagation()
			}
			if (ref.current && !ref.current.contains(event.target)) {
				callback()
				// alert("You clicked outside of me!");
			}
		}

		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			// Unbind the event listener on clean up
			callback()

			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [ref])
}
export default useOutsideClick
/**
 * Component that alerts if you click outside of it
 
export default function OutsideAlerter(props) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    return <div ref={wrapperRef}>{props.children}</div>;
}
*/
