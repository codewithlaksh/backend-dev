export const extractCloudinaryPublicId = (cloudinaryUrl) => {
    if (!cloudinaryUrl) return null;

    try {
        const url = new URL(cloudinaryUrl);
        const uploadIndex = url.pathname.indexOf("/upload/");

        if (uploadIndex === -1) return null;

        let publicIdWithVersion = url.pathname.slice(uploadIndex + "/upload/".length);

        const pathParts = publicIdWithVersion.split("/");

        const versionIndex = pathParts.findIndex((part) => /^v\d+$/.test(part));

        if (versionIndex !== -1) {
            publicIdWithVersion = pathParts.slice(versionIndex + 1).join("/");
        } else {
            publicIdWithVersion = pathParts.join("/");
        }

        const publicId = publicIdWithVersion.replace(/\.[^/.]+$/, "");

        return decodeURIComponent(publicId);
    } catch {
        return null;
    }
};