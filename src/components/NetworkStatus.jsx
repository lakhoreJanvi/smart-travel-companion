import { useEffect, useState } from 'react';

const NetworkStatus = () => {
    const [networkStatus, setNetworkStatus] = useState('checking network...');

    useEffect(() =>{
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        function updateStatus() {
            if(connection){
                let status = `connection type: ${connection.effectiveType}`;
                if(connection.effectiveType.includes('2g') || connection.effectiveType.includes('slow')){
                    status += `(slow connection detected!)`;
                }
                setNetworkStatus(status);
            }else{
                setNetworkStatus('Network Information API not supported');
            }
        }
        updateStatus();
        connection ?.addEventListener('change', updateStatus);
        return () => connection?.removeEventListener('change', updateStatus);
    }, []);

    return (
        <div className='status' style={{backgroundColor: networkStatus.includes('slow')? '#ffcccc' : '#e0e0e0'}}>
            {networkStatus}
        </div>
    );
}

export default NetworkStatus