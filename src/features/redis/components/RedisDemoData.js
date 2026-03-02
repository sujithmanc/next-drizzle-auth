import { redisClient } from "../redis";

export default async function RedisDemoData() {

    const data = await redisClient.get("data");

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Redis Demo Data</h2>
            <p className="mb-2">Data from Redis: {data}</p>
        </div>
    );
}