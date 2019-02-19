declare module 'colossus' {
  import { Context as KoaContext } from 'koa'

  export interface IOContext {
    account: string
    workspace: string
    authToken: string
    params: { [param: string]: string }
    userAgent: string
    region: string
    route: { [param: string]: any }
  }

  export interface ColossusContext extends KoaContext {
    vtex: IOContext
  }
}

interface timeline {
  date: string
  state: string
}

interface statusTimeline {
  date: string
  state: string
  id?: string
  subject?: string
  userName?: string
  userEmail?: string
}

interface note {
  description: string
  domain: string
  target: { type: string; id: string; url: string }
}

interface conversationMessage {
  id: string
  from: {
    conversationRelatedTo: string
    conversationSubject: string
    emailAlias: string
    aliasMaskType: 1
    email: string
    name: string
    role: {}
  }
  to: {
    conversationRelatedTo: string
    conversationSubject: string
    emailAlias: string
    aliasMaskType: 1
    email: string
    name: string
    role: string
  }[]
  subject: string
  firstWords: string
  body: string
  hasAttachment: boolean
  attachmentNames: string[]
  date: string
}

type httpMethods = 'get' | 'post' | 'put' | 'patch'
