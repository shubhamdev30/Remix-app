import cron from "node-cron";

export async function ReportSchedular(testdb, store, schedule, callback,status) {
    var myCronJob = cron.schedule(`*/2 * * * *`, () => callback(), {name:store});

    if(status == "start"){
    return myCronJob;
    }else{
        return myCronJob.stop();
    }
}