import "dotenv/config";
import { SWAGGER_ENDPOINT } from "./common-configuration";

const port = process.env.PORT ?? 5001;

function exposeSwaggerUrlInLogs() {
    if (process.env.NODE_ENV !== "development") return;
    
    const url = `http://localhost:${port}/${SWAGGER_ENDPOINT}`;
    console.log("\n📖 Swagger is available at:");
    console.log(`   👉 ${url}\n`);
}

function exposeLensDashboardForDev() {
    if (process.env.NODE_ENV !== "development") return;

    const url = `http://localhost:${port}/lens`;
    console.log("\n📖 Lens Dashboard is available at:");
    console.log(`   👉 ${url}\n`);
}

const usePostBootstrap = () => {
    exposeSwaggerUrlInLogs();
    exposeLensDashboardForDev();
}

export default usePostBootstrap;