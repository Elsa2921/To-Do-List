let config = null;
export const loadConfig = async () =>{
    if(!config){
        const res = await fetch(`${process.env.PUBLIC_URL}/config.json`);
        config = await res.json();

    }
    return config;
}

export const getAppConfig = () => config;