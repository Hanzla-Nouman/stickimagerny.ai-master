import { Suspense } from 'react'

export default function LoginLayout(props) {
    const { children, params } = props;
    
    return  <Suspense>{children} </Suspense>
}
