import { httpClient } from "../http/httpClient";
import { redisClient } from "../cache/redisClient";

export const getAllBreeds = async () => {
  const cacheKey = "/dogs";
  const cachedValue = await redisClient.get(cacheKey);

  if (cachedValue) {
    console.log("cache HIT");
    return JSON.parse(cachedValue);
  }

  const breeds = await httpClient
    .get("https://dog.ceo/api/breeds/list/all")
    .then((httpResponse) => httpResponse.data);

  console.log("cache MISS");
  await redisClient.set(cacheKey, JSON.stringify(breeds), {
    EX: 5,
  });

  return breeds;
};
