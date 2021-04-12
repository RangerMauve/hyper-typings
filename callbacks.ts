/* eslint-disable @typescript-eslint/method-signature-style */

// TODO: Support abstract-encoding
export type Encoding = 'binary' | 'json' | 'utf-8'

// TODO: Might want to spec out Corestore?
// TODO: Maybe we should Type random-access-storage?

export interface Peer {
  remotePublicKey: Buffer
}

export interface Extension<M> {
  send(message: M, peer: Peer): void
  broadcast(message: M): void
}

export interface ExtensionHandlers<M> {
  encoding?: Encoding
  onmessage: (message: M, peer: Peer) => void
  onerror: (error: Error) => void
}

export interface HypercoreGetOptions {
  wait?: boolean
  timeout?: number
  valueEncoding: Encoding
}

export interface DownloadRange {
  start?: number
  end?: number
  linear?: boolean
  blocks?: number[]
}

export interface Node {
  index: number
  size: number
  hash: Buffer
}

export interface UpdateOptions {
  ifAvailable?: boolean
  minLength?: number
}

export interface HypercoreReadStreamOpts {
  start?: number
  end?: number
  snapshot?: boolean
  tail?: boolean
  live?: boolean
  timeout?: number
  wait?: number
  batch?: number
}

export interface HypercoreWriteStreamOpts {
  maxBlockSize?: number
}

export interface AuditResult {
  valid: number
  invalid: number
}

export interface NetworkStat {
  uploadedBytes: number
  uploadedBlocks: number
  downloadedBytes: number
  downloadedBlocks: number
}

export interface NetworkStats {
  totals: NetworkStat
  peers: NetworkStat[]
}

export interface Have {
  start?: number
  length? : number
  bitfield?: Buffer
}

export interface Hypercore<E=Buffer> {
  readonly writable: boolean
  readonly readable: boolean
  readonly key: Buffer
  readonly discoveryKey: Buffer
  readonly length: number
  readonly byteLength: number
  readonly stats: NetworkStats
  readonly peers: Peer[]

  on(event: 'peer-add', listener: (peer: Peer) => any): Hypercore
  on(event: 'peer-remove', listener: (peer: Peer) => any): Hypercore
  on(event: 'peer-open', listener: (peer: Peer) => any): Hypercore
  on(event: 'peer-ack', listener: (peer: Peer, have: Have) => any): Hypercore
  on(event: 'ready', listener: () => any): Hypercore
  on(event: 'error', listener: (error: Error) => any): Hypercore
  on(event: 'upload', listener: (index: number, data: E) => any): Hypercore
  on(event: 'append', listener: () => any): Hypercore
  on(event: 'close', listener: () => any): Hypercore

  once(event: 'peer-add', listener: (peer: Peer) => any): Hypercore
  once(event: 'peer-remove', listener: (peer: Peer) => any): Hypercore
  once(event: 'peer-open', listener: (peer: Peer) => any): Hypercore
  once(event: 'peer-ack', listener: (peer: Peer, have: Have) => any): Hypercore
  once(event: 'ready', listener: () => any): Hypercore
  once(event: 'error', listener: (error: Error) => any): Hypercore
  once(event: 'upload', listener: (index: number, data: E) => any): Hypercore
  once(event: 'append', listener: () => any): Hypercore
  once(event: 'close', listener: () => any): Hypercore

  ready(cb: (err?: Error) => void): void

  registerExtension<M=Buffer>(name: string, handlers: ExtensionHandlers<M>): Extension<M>

  append(data: E): Promise<number>
  get(index: number, options: HypercoreGetOptions, cb: (err: Error | null, data: E) => void): void
  get(index: number, cb: (err: Error | null, data: E) => void): void
  getBatch(start: number, end: number, options: HypercoreGetOptions, cb: (err: Error| null, data: E[]) => void): void
  getBatch(start: number, end: number, cb: (err: Error| null, data: E[]) => void): void
  head(options: HypercoreGetOptions, cb: (err: Error| null, data: E) => void): void
  head(cb: (err: Error| null, data: E) => void): void
  download(range: DownloadRange, cb: (err: Error| null) => void): void
  download(cb: (err: Error| null) => void): void
  signature(index: number, cb: (err: Error| null, signature: Buffer) => void): void
  signature(cb: (err: Error| null, signature: Buffer) => void): void
  verify(index: number, signature: Buffer, cb: (err: Error| null, valid: boolean) => void): void
  rootHashes(index: number, cb: (err: Error| null, roots: Node[]) => void): void
  downloaded(start?: number, end?: number): number
  has(index: number, end?: number): boolean
  clear(start: number, end: number, cb: (err: Error| null) => void): void
  clear(start: number, cb: (err: Error| null) => void): void
  seek(offset: number, cb: (err: Error| null, index: number, relativeOffset: number) => void): void
  update(minLength: UpdateOptions | number, cb: (err: Error| null) => void): void
  update(cb: (err: Error| null) => void): void
  setDownloading(downloading: boolean): void
  setUploading(uploading: boolean): void

  createReadStream(options? : HypercoreReadStreamOpts): NodeJS.ReadableStream
  createWriteStream(options? : HypercoreWriteStreamOpts): NodeJS.WritableStream

  close(cb: (err: Error| null) => void): void
  destroyStorage(cb: (err: Error| null) => void): void
  audit(cb: (err: Error| null, auditResult: AuditResult) => void): void
}

export interface TagMap {
  [id: string]: number
}

export interface ReadStreamOptions {
  start?: number
  end?: number
  length?: number
}

export interface EncodableOptions {
  encoding?: Encoding
}

export interface ReadDirOptions {
  recursive? : boolean
  noMounts? : boolean
}

export interface Stat {
  dev: number
  nlink: 1
  rdev: number
  blksize: number
  ino: number
  mode: number
  uid: number
  gid: number
  size: number
  offset: number
  blocks: number
  atime: string
  mtime: string
  ctime: string
  linkname: string
  isDirectory(): boolean
  isFile(): boolean
  isSymLink(): boolean
}

export interface MountInfo {
  feed: Hypercore
  mountPath: string
  mountInfo: any
}

export type FD = number

export interface Watcher {
  destroy(): void
}

export interface MountOptions {
  version?: number
}

export interface GetMountsOptions {
  memory?: boolean
}

export interface MountFeeds {
  path: string
  metadata: Hypercore
  content: Hypercore
}

export interface MountMap {
  [path: string]: MountFeeds
}

export interface Hyperdrive {
  readonly version: number
  readonly key: Buffer
  readonly discoveryKey: Buffer
  readonly writable: boolean
  readonly peers: Peer[]

  on(event: 'ready', listener: () => any): Hyperdrive
  on(event: 'error', listener: (error: Error) => any): Hyperdrive
  on(event: 'update', listener: () => any): Hyperdrive
  on(event: 'peer-add', listener: (peer: Peer) => any): Hyperdrive
  on(event: 'peer-open', listener: (peer: Peer) => any): Hyperdrive
  on(event: 'peer-remove', listener: (peer: Peer) => any): Hyperdrive
  on(event: 'close', listener: () => any): Hyperdrive

  once(event: 'ready', listener: () => any): Hyperdrive
  once(event: 'error', listener: (error: Error) => any): Hyperdrive
  once(event: 'update', listener: () => any): Hyperdrive
  once(event: 'peer-add', listener: (peer: Peer) => any): Hyperdrive
  once(event: 'peer-open', listener: (peer: Peer) => any): Hyperdrive
  once(event: 'peer-remove', listener: (peer: Peer) => any): Hyperdrive
  once(event: 'close', listener: () => any): Hyperdrive

  registerExtension<M=Buffer>(name: string, handlers: ExtensionHandlers<M>): Extension<M>

  ready(cb: (err: Error| null) => void): void

  checkout(version: number): Hyperdrive
  createTag(name: string, version: number, cb: (err: Error| null) => void): void
  createTag(name: string, cb: (err: Error| null) => void): void
  getTaggedVersion(name: string, cb: (err: Error| null, version: number) => void): void
  deleteTag(name: string, cb: (err: Error| null) => void): void
  getAllTags(cb: (err: Error| null, tags: TagMap) => void): void

  download(path: string, cb?: (err: Error| null) => void): void
  download(cb?: (err: Error| null) => void): void

  createReadStream(name: string, options? : ReadStreamOptions): NodeJS.ReadableStream
  readFile<E=Buffer>(name: string, options: EncodableOptions, cb: (err: Error| null, data: E) => void): void
  readFile<E=Buffer>(name: string, cb: (err: Error| null, data: E) => void): void

  createWriteStream(name: string): NodeJS.WritableStream
  writeFile(name: string, data: Buffer | string, options: EncodableOptions, cb: (err: Error| null) => void): void
  writeFile(name: string, data: Buffer | string, cb: (err: Error| null) => void): void

  unlink(name: string, cb: (err: Error| null) => void): void

  mkdir(name: string, cb: (err: Error| null) => void): void
  symlink(target: string, linkname: string, cb: (err: Error| null) => void): void
  rmdir(name: string, cb: (err: Error| null) => void): void
  readdir(name: string, options: ReadDirOptions, cb: (err: Error| null, items: string[] | Stat[]) => void): void
  readdir(name: string, cb: (err: Error| null, items: string[] | Stat[]) => void): void

  stat(name: string, cb: (err: Error| null, stat: Stat) => void): void
  lstat(name: string, cb: (err: Error| null, stat: Stat) => void): void
  info(name: string, cb: (err: Error| null, info: MountInfo) => void): void
  access(name: string, cb: (err: Error| null) => void): void

  open(name: string, flags: string, cb: (err: Error| null, fd: FD) => void): void
  read(fd: FD, buf: Buffer, offset: number, len: number, position: number, cb: (err: Error| null) => void): void
  write(fd: FD, buf: Buffer, offset: number, leng: number, position: number, cb: (err: Error| null) => void): void

  watch(name: string, onchage: () => void): Watcher

  mount(name: string, key: Buffer, opts: MountOptions, cb: (err: Error| null) => void): void
  mount(name: string, key: Buffer, cb: (err: Error| null) => void): void
  unmount(name: string, cb: (err: Error| null) => void): void
  createMountStream(options?: MountOptions): NodeJS.ReadableStream
  getAllMounts(options: MountOptions, cb: (err: Error| null, mounts: MountMap) => void): void
  getAllMounts(cb: (err: Error| null, mounts: MountMap) => void): void

  close(fd: FD, cb: (err: Error| null) => void): void
  close(cb: (err: Error| null) => void): void
  destroyStorage(cb: (err: Error| null) => void): void
}

export interface KeyPair {
  publicKey: Buffer
  secretKey: Buffer
}
