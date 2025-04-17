export function getPageUrl(paginator, pageNumber) {
    const link = paginator.links.find(item => item.label === String(pageNumber));
    return link ? link.url : null;
}
