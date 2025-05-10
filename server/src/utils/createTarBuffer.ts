import { PassThrough } from 'stream';
import tar from 'tar-stream';

export async function createTarBuffer(
    files: Record<string, string>,
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const pack = tar.pack();
        const chunks: Buffer[] = [];
        const passthrough = new PassThrough();

        passthrough.on('data', (chunk: Buffer) => chunks.push(chunk));
        passthrough.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        passthrough.on('error', (err) => {
            reject(err);
        });

        const fileEntries = Object.entries(files);
        let pending = fileEntries.length;

        for (const [fileName, content] of fileEntries) {
            pack.entry({ name: fileName }, content, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                pending--;
                if (pending === 0) {
                    pack.finalize();
                }
            });
        }

        pack.pipe(passthrough);
    });
}
