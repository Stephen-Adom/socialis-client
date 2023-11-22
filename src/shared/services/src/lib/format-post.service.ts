import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class FormatPostService {

    constructor(
        private sanitizer: DomSanitizer,
    ) { }

    formatPostContent(content: string) {
        // Regular expression to find mentions
        const mentionRegex = /@(\w+)/g;

        // Replace mentions with links
        const formattedText = content.replace(mentionRegex, (match, username) => {
            const mentionLink = `<a class="text-primaryColor font-semibold" href='/user/${username}/profile'>${match}</a>`;
            return mentionLink;
        });

        return this.sanitizer.sanitize(
            SecurityContext.HTML,
            formattedText
        );
    }
}