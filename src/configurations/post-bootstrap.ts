import "dotenv/config";
import { SWAGGER_ENDPOINT } from "./common-configuration";

function exposeSwaggerUrlInLogs() {
    if (process.env.NODE_ENV !== "development") return;
    
    const port = process.env.PORT ?? 5001;
    const url = `http://localhost:${port}/${SWAGGER_ENDPOINT}`;
    console.log("\n📖 Swagger is available at:");
    console.log(`   👉 ${url}\n`);
}

const usePostBootstrap = () => {
    exposeSwaggerUrlInLogs();
}

export default usePostBootstrap;