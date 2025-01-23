export default defineNuxtPlugin(() => {
    let db: IDBDatabase | null = null;

    // تابع برای باز کردن یا ایجاد دیتابیس IndexedDB
    const openDB = (): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('messenger', 1);

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains('files')) {
                    db.createObjectStore('files', { keyPath: 'name' });
                }
            };

            request.onsuccess = (event: Event) => {
                db = (event.target as IDBOpenDBRequest).result;
                resolve(db);
            };

            request.onerror = (event: Event) => {
                reject('Error opening IndexedDB');
            };
        });
    };

    // ذخیره یک فایل در IndexedDB
    const saveFile = async (name: string, fileBlob: Blob): Promise<string> => {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            const request = store.put({ name: name, file: fileBlob });

            request.onsuccess = () => resolve('File saved successfully');
            request.onerror = () => reject('Error saving file');
        });
    };

    // بازیابی یک فایل از IndexedDB
    const loadFile = async (name: string): Promise<Blob> => {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const request = store.get(name);

            request.onsuccess = (event: Event) => {
                const result = (event.target as IDBRequest).result;
                if (result) {
                    resolve(result.file);
                } else {
                    reject('File not found');
                }
            };

            request.onerror = () => reject('Error retrieving file');
        });
    };

    return {
        provide: {
            indexedDB: {
                saveFile,
                loadFile,
            },
        },
    };
});
