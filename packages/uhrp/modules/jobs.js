module.exports = {
    Init: () => {
        DB.Handle.query("SELECT * FROM jobs", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                result[i].sqlId = result[i].id;
                delete result[i].id;

                initJobUtils(result[i]);
            }

            mp.jobs = result;
            console.log(`Works loaded: ${i} units.`);

            initJobsUtils();
        });
    }
}

function initJobsUtils() {
    mp.jobs.getBySqlId = (sqlId) => {
        for (var i = 0; i < mp.jobs.length; i++) {
            if (mp.jobs[i].sqlId == sqlId) return mp.jobs[i];
        }
        return null;
    };
}

function initJobUtils(job) {
    job.setName = (name) => {
        job.name = name;
        DB.Handle.query("UPDATE jobs SET name=? WHERE id=?", [job.name, job.sqlId]);
    };
    job.setLevel = (level) => {
        job.level = Math.clamp(level, 1, 200);
        DB.Handle.query("UPDATE jobs SET level=? WHERE id=?", [job.level, job.sqlId]);
    };
}
