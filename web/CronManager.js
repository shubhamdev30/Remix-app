import cron from "node-cron";

let myCronJob = {};

export async function startCronJob(testdb, store, schedule, callback) {

  const collection = testdb.collection("cronJobs");
  const existingJob = await collection.findOne({ store });

  if (!existingJob) {
    const cronJobInfo = {
      store,
      schedule
    };

    await collection.insertOne(cronJobInfo);
  }

  myCronJob = cron.schedule(schedule, () => callback(store),{name:store});
  const alltask =  cron.getTasks().get(store);

  console.log(`Cron job started for store ${store}`);
  console.log(alltask);


   
}

export async function stopCronJob(testdb, store) {
  
  const collection = testdb.collection("cronJobs");

  const existingJob = await collection.findOne({ store });
 
  if (existingJob) {
      await collection.deleteOne({ store });
      console.log(`Cron ${store} deleted`);
    } 

  const alltask =  cron.getTasks().get(store);
  console.log(alltask);
  if(alltask){
  alltask.stop();
  }
  console.log(`Cron job stopped for store ${store}`);
  

}

