import ora from 'ora';

export function spinner(text: string, promise: Promise<any>): Promise<any> {
    const spinner = ora(text).start();
    return promise
        .then((res) => {
            spinner.succeed();
            return res;
        })
        .catch((e) => {
            console.error(e);
            spinner.fail();
        });
}
